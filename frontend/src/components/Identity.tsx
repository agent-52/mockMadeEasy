
export function Identity({name, imageLink}:{name:string, imageLink:string}){
    return(
        <div className="flex gap2 alignC">
            <div className="identityImgContainer">
                <img src={imageLink} alt="" />
            </div>
            <p className="color2 w500 fS">{name}</p>
        </div>
    )
}