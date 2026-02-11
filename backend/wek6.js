function isAccendingOrder(arr){
    for(i=0; i<arr.length; i++){
       for(j=0; j<arr.length-1; j++){
        if(arr[j]>arr[j+1]){
            let temp=arr[j]
            arr[j]=arr[j+1]
            arr[j+1]=temp
        }
       }
    }
    return arr
}
console.log(isAccendingOrder([2,3,5,6,3,2,1]))

function isDecendingOrder(arr){
    for(let i=0; i<arr.length; i++){
        for(j=0; j<arr.length-1; j++){
            if(arr[j]<arr[j+1]){
                let temp=arr[j]
                arr[j]=arr[j+1]
                arr[j+1]=temp
            }
        }
    }
    return arr
}
console.log(isDecendingOrder([4,3,5,6,7,2,3,5]))

function isCount(str){
    let number=0
    let vowels=0
    let consonent=0
    let small_letter=0
    let capital_letter=0
    for(let i=0; i<str.length; i++){
        let ch=str[i]
        if(ch>="0" && ch<="9"){
             number++
        }
        
       
        else if (ch>="a" && ch<="z" ){
             small_letter++
             if("aeiou".includes(ch)){
                vowels++
             }
             else{
                consonent++
             }
        }
        else if(ch>="A" && ch<="Z"){
             capital_letter++
             if("AEIOU".includes(ch)){
                vowels++
             }
             else{
                consonent++
             }
        }
    }
    return {number, vowels, consonent, small_letter, capital_letter}
}
console.log(isCount("fhsnso84522hifjhADF39jkfsgedfugfdSDAlfs"))
function isFactorial(num){
    result=1
    for(let i=1; i<=num; i++){
        result=result*i
    }
    return result
}
console.log(isFactorial(5))

