function CountArray(arr){
    let count=0
    for(let i=0; i<arr.length; i++)
    {
        if(arr[i]>0){
            count++
        }
    }
    return count
}

function CountEvenOdd(arr){
    let even=0
    let odd=0
    for(let i=0; i<arr.length; i++){
        let ch=arr[i]
        if(ch%2===0){
            even++
        }
        else odd++
    }
    return {even, odd}
}

function LongestSubstring(str){
    let seen =new Set()
    let left=0
    let maxLen=0
    for(let i=0; i<str.length; i++){
        while(seen.has(str[i])){
            seen.delete(str[left])
            left++
        }
        seen.add(str[i])
        maxLen=Math.max(maxLen, i-left+1)
    }
    return  {maxLen, seen, left}
}
console.log(LongestSubstring("ajkdhwauybada"))
console.log(CountArray([1,2,3,4]))
console.log(CountEvenOdd([1,2,3,4,6,3,4,8,9]))
