
export function InputWithLabel({name, type, labelName, placeHolder, onChangeFn}:{name:string, labelName:string, placeHolder:string, type:string, onChangeFn:any}){
    return (
        <div className="inputWithLabel flexC gap1">
            <label htmlFor={name}>{labelName}</label>
            <input className="pad1 bg3 color1 border" type={type} placeholder={placeHolder} name={name} onChange={onChangeFn}/>
        </div>
    )
}