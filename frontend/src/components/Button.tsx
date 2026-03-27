

export function Button({text, className, paddingX, paddingY, onClickFn = {}, disabled=false}: {text: string, className:string, paddingX:number, paddingY:number , onClickFn:any ,disabled:boolean}){
    return(
        <button onClick={onClickFn} className={className} style={{paddingInline:paddingX+"px", paddingBlock:paddingY+"px"}} disabled={disabled}>{text}</button>
    )
}
export function ButtonWithImage({text, className, paddingX, paddingY, icon, onClickFn, disabled=false}: {text: string, className:string, paddingX:number, paddingY:number, icon:any , onClickFn:any, disabled:boolean}){
    return(
        <button disabled={disabled} className={className} style={{paddingInline:paddingX+"px", paddingBlock:paddingY+"px"}} onClick={onClickFn} >
            <div className="feature-icon">{icon}</div>
            <span>{text}</span>
        </button>
    )
}