import  { useState } from 'react'

export const DragDrop = () => {
    const [leftItems, setLeftItems] = useState(["apple", "mango", "Pineapple"])
    const [rightItems, setRightItems]=useState<string[]>([])

    const handaleDrageItems=(
        e:React.DragEvent<HTMLDivElement>, 
        item: string, 
        from: "left" | "right")=>{
            e.dataTransfer.setData("application/json", JSON.stringify({item, from}))
        }
    const handaleDropItems=(
        e:React.DragEvent<HTMLDivElement>,
        to: "left"| "right"
    )=>{
        e.preventDefault()
        const data=JSON.parse(e.dataTransfer.getData("application/json")) as {item: string, from: "left"| "right"}

        if(data.from===to) return

        if(to==="left"){
            setRightItems(prev=>prev.filter(i=>i !== data.item))
            setLeftItems(prev=>[...prev, data.item])
        }
        else{
            setLeftItems(prev=> prev.filter(i=> i!==data.item))
            setRightItems(prev=>[...prev, data.item])
        }


    }
  return (
    <div className='p-4 w-5xl mx-auto flex gap-9'>
        <div 
        className='w-48 min-h-[400px] border border-dashed p-4'
        onDragOver={(e)=>e.preventDefault()}
        onDrop={(e)=>handaleDropItems(e, "left")}
        
        >
            {leftItems.map(item=>(
                <div 
                key={item}
                draggable
                onDragStart={(e)=>handaleDrageItems(e, item, "left")}
                className='p-4 cursor-pointer rounded-sm bg-blue-400 pb-4'>
                    {item}
                    </div>
            ))}

        </div>
        <div 
        className='w-48 min-h[400px] border border-dashed p-4'
        onDragOver={(e)=>e.preventDefault()}
        onDrop={(e)=>handaleDropItems(e, "right")}
        >
            {rightItems.map(item=>(
                <div
                key={item}
                draggable
                onDragStart={(e)=>handaleDrageItems(e, item, "right")}
                >
                    </div>
            ))}
        </div>

    </div>
  )
}
