function reverseFor(arr){
    if(typeof arr==="string"){
        let result=""
        for(let i=arr.length-1; i>=0; i--){
            result+=arr[i]
        }
        return result
    }
    let n=arr.length
    for(let i=0; i<n/2; i++){
        let temp=arr[i]
        arr[i]=arr[n-1-i]
        arr[n-1-i]=temp

    }
    return arr
}

function reverseWhile(arr){
     if(typeof arr==="string"){
        let result=""
        for(let i=arr.length-1; i>=0; i--){
            result+=arr[i]
        }
        return result
    }
    let left=0
    let right=arr.length-1

    while(left< right){
        let temp=arr[left]
        arr[left]=arr[right]
        arr[right]=temp
        left++
        right--
    }
    return arr
}

function reverseForString(str){
    
    if(typeof str==="string"){
        let result=""
        for(let i=str.length-1; i>=0; i--){
            result+=str[i]
        }
        return result
    }
}
console.log(reverseWhile([1,2,3,4]))
console.log(reverseWhile("hjhiesd"))
console.log(reverseForString("jdowjoweiu"))
console.log(reverseFor([1,2,3,4]))
console.log(reverseFor("jdowjoweiu"))

function charFrequency(str){
    let freq={}
    for(let ch of str){
        if(ch===" ")continue
        freq[ch]=(freq[ch]|0)+1
    }
    return freq
}
console.log(charFrequency("ytjhswdeuas jhgth"))

function isPrime(n){
    if(n<=1) return false

    for(let i=2; i<n; i++){
        if(n%i===0){
            return false
        }
    }
    return true
}

console.log(isPrime(7))