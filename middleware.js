export function handelError(error ,req, res, next){
    if(error) {
        console.error(error)
        return res.status(500).json({message:error.message})
    }
    next()
}