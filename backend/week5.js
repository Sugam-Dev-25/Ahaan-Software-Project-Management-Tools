function WordCount(str){
    str=str.toLowerCase().split(" ")
   freq={}
    for(let i=0; i<str.length; i++){
        let ch=str[i]
       freq[ch]=(freq[ch]|0)+1
    }
    return  freq
}

function wordLetterCount(str){
    let digit=0
    let letter=""
    for(let i=0; i<str.length; i++){
        let ch= str[i]
        if(ch>="0" && ch<="9"){
            digit++
        }
        if(ch>="A" && ch<="Z"){
            letter++
        }
        if(ch>="a" && ch<="z"){
            letter++
        }
    }
    return {digit, letter}
}

function MaxsumofArray(nums, k){
    let windowSum=0
    let maxSum=0
    for(let i=0; i<k; i++){
        windowSum +=nums[i]
    }
    maxSum=windowSum
    for(let i=k; i<nums.length; i++){
        windowSum+=nums[i]
        windowSum-=nums[i-k]

        maxSum=Math.max(maxSum, windowSum)
    }
    return maxSum
}
console.log(MaxsumofArray([2,1,3,5,1,3,2], 3))
console.log(wordLetterCount("jdkijwiuoe89234hd23jd2"))
console.log(WordCount("this is is this is a fuck boy fuck"))