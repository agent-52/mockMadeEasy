import { useState , useRef, useEffect, forwardRef, useImperativeHandle} from "react";
import { Button, ButtonWithImage } from "../Button";
import { Mic, StopCircle } from "lucide-react";
import { interviewStore } from "../../store/interview.store";


export const TheoryAnswerPanel = forwardRef(({answerDraft, setAnswerDraft, handleSubmitAnswer, question}:{answerDraft:any, setAnswerDraft:any, handleSubmitAnswer:() => void, question:any}, ref) => {
  const [isRecording, setIsRecording] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isConnecting, setIsConnecting] = useState(false)

  const isSubmittingAnswer = interviewStore((s:any) => s.isSubmittingAnswer)
  const isEvaluatingPhase = interviewStore((s:any) => s.isEvaluatingPhase)
  const isEvaluatingCode = interviewStore((s:any) => s.isEvaluatingCode)

  const socketRef = useRef<WebSocket |null>(null)
  const audioContextRef = useRef<AudioContext|null>(null)
  const streamRef = useRef<MediaStream |null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode|null>(null)
  const workletNodeRef = useRef<AudioWorkletNode|null>(null)
  const pcmBufferRef = useRef<Float32Array[]>([]);

  useEffect(() => {
    return () => {
      
      streamRef.current?.getTracks().forEach(track => track.stop());
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    setFinalTranscript("")
    setInterimTranscript("")
    setAnswerDraft({
      response: "",
      skipped: false
    })
  }, [question])

  useImperativeHandle(ref, () => ({stopRecording}))

  function startRecording(){

    //guards
    if (isRecording || isConnecting) return;
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    setIsConnecting(true)

    //resetting old transcipt content
    setInterimTranscript("")
    setFinalTranscript("")
    //

    //reseting answer draft
    setAnswerDraft({
      response:"",
      skipped:false
    })

    socketRef.current = new WebSocket("ws://localhost:3000")

    if(socketRef.current){
      socketRef.current.onmessage = (event) => {
        
        let parsed
        try {
          parsed = JSON.parse(event.data)
        } catch (error) {
          return 
        }
        
        const {type, transcript, isFinal}:{type:string, transcript:string, isFinal:boolean} = parsed
        console.log({transcript, isFinal})
        if(isFinal){
          setFinalTranscript((prev) =>{
            const newText =  prev+transcript+" "
            setAnswerDraft({
              response: newText,
              skipped:false
            })
            return newText
          })
          setInterimTranscript("")
        }else{
          setInterimTranscript(transcript)
        }
      }
    }

    socketRef.current.onclose = () => {
      console.log("Client disconnected")
      setIsRecording(false)
    }

    socketRef.current.onopen = async () =>{
      console.log("connection established with backend")
       setIsConnecting(false)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true})
        streamRef.current = stream

        const audioContext = new AudioContext()
        audioContextRef.current = audioContext
        
        await audioContext.audioWorklet.addModule('/pcm-processor.js');

        // console.log("AudioContext state:", audioContext.state);

        const source = audioContext.createMediaStreamSource(stream)
        sourceRef.current = source

        const workletNode = new AudioWorkletNode(audioContext, 'pcm-processor');
        workletNodeRef.current = workletNode
        source.connect(workletNode);

        console.log("Sample rate:", audioContext.sampleRate);

        workletNode.port.onmessage = (event) => {
          const float32Data = event.data;

          pcmBufferRef.current.push(float32Data);

          const totalSamples = pcmBufferRef.current.reduce(
            (acc, arr) => acc + arr.length,
            0
          );

          if (totalSamples >= 16384) {
            const combined = new Float32Array(totalSamples);
            let offset = 0;

            for (const chunk of pcmBufferRef.current) {
              combined.set(chunk, offset);
              offset += chunk.length;
            }

            pcmBufferRef.current = [];

            const pcmBuffer = convertFloat32ToInt16(combined);

            if (socketRef.current?.readyState === WebSocket.OPEN) {
              socketRef.current.send(pcmBuffer);
            }
          }
        };


        setIsRecording(true)

      } catch (error) {
        console.error("mic permission denied", error)
        socketRef.current?.close()
      }
      

      
    }

    socketRef.current.onclose = () => console.log("CLosed", socketRef.current?.readyState)

    //error ane pe ek div mai error ke according message show karna hai
    socketRef.current.onerror = (e) => console.log("ERROR", e);

  }

  function stopRecording(){

    if(!isRecording) return

    workletNodeRef.current?.disconnect()
    sourceRef.current?.disconnect()

    if(audioContextRef.current && audioContextRef.current.state !== "closed"){
        audioContextRef.current.close()
    }

    streamRef.current?.getTracks().forEach(track => track.stop())

    if(socketRef.current){
        socketRef.current.onmessage = null
        socketRef.current.close()
        socketRef.current = null
    }

    if(interimTranscript && interimTranscript.trim().length > 0){
        setFinalTranscript(prev => prev + interimTranscript + " ")
        setInterimTranscript("")
    }

    setIsRecording(false)
  }

  function isSubmitDisabled(){
    if(isRecording || !answerDraft?.response?.trim() || isSubmittingAnswer || isEvaluatingCode || isEvaluatingPhase){
      return true
    }else{
      return false
    }
  }

  function isRecordingDisabled(){
    if(isSubmittingAnswer || isEvaluatingPhase || isEvaluatingCode){
      return true
    }
    return false
  }

  function convertFloat32ToInt16(buffer: Float32Array) {
    const output = new ArrayBuffer(buffer.length * 2);
    const view = new DataView(output);

    let offset = 0;
    for (let i = 0; i < buffer.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, buffer[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);

    }

    return output;
  }



  return (
    <div className="answer-panel padX4 flexC gap4 ">

        <h2 className="fM">Your Response</h2>
        <div>
            {isRecording?
            (<ButtonWithImage text="Stop Speaking"  className="btn-secondary flex gap1 alignC justifyC fullWidth recorder" paddingX={6} paddingY={5} icon={<StopCircle /> } onClickFn={stopRecording} disabled={isRecordingDisabled()}/>):
            <ButtonWithImage text={isConnecting? "Connecting...":"Start Speaking"}  className="btn-primary flex gap1 alignC justifyC fullWidth" paddingX={6} paddingY={5} icon={<Mic /> } onClickFn={startRecording} disabled={isRecordingDisabled()}/>}
        </div>

      {isRecording && (
        <div className="waveform">
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>
      )}

      
      <textarea
        value={isRecording? finalTranscript + interimTranscript : finalTranscript}
        onChange={e => {
          const value = e.target.value
          if(!isRecording && !isSubmittingAnswer){
            setFinalTranscript(value)}
            setAnswerDraft({
              response:value,
              skipped:false,
            })
          } 
        }
        placeholder="Your answer transcript will appear here..."
        className="pad4 fS shadow"
      />
      
      <div className="flex alignC justifyE gap3">
        <Button text="Submit answer" paddingX={16} paddingY={10} onClickFn={() => {if(isRecording) {stopRecording()}
          handleSubmitAnswer()
        }} className="btn-primary" disabled={isSubmitDisabled()}/>
        <Button text="Skip" className="btn-secondary" paddingX={16} paddingY={10} onClickFn={() => {if (isRecording) return
        setAnswerDraft({
            response:"",
            skipped:true
        })
        handleSubmitAnswer()}} disabled={isRecording || isSubmittingAnswer || isEvaluatingCode || isEvaluatingPhase} />
      </div>
    </div>
  );
});