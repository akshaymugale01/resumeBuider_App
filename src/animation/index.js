export const slideUpMenu ={
    initial:{opacity:0 , scale: .7},
    animte :{opacity:1 , scale: 1},
   exit    :{opacity:0  , scale: .7}
}


export const FliterAnimate = {
    initial:{ opacity:0, scale:0.6, y:20 },
           animate:{ opacity:1, scale:1, y:0 },
           exit:{ opacity:0, scale:0.6, y:20 },
}

export const tempDesign = (index) =>{
    return{
    initial:{opacity:0, scale:0.85},
    animate:{opacity:1, scale: 1},
    exit:{opacity:0, scale: 0.85},
    transition:{delay: index * 0.3, ease: "easeInOut"},
    }
}