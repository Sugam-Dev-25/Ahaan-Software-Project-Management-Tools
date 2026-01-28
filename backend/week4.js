function palindrome(arr){
    let n=arr.length
    for(let i=0; i<n/2; i++){
       if(arr[i]!==arr[n-1-i]){
        return false
       }
    }
    return true
}

function PalindromeWhile(arr){
    let left=0
    let right=arr.length-1
    while(left<right){
        if(arr[left]!==arr[right]){
            return false
        }
        left++
        right--
    }
    return true
}

function twoSums(nums, target){
    let seen={}
    for(let i=0; i<nums.length; i++){
        let current=nums[i]
        let need=target-current
        if(seen[need]!==undefined){
            return [seen[need], i]
        }
        seen[current]=i
    }
    return []
}
console.log(palindrome([1,2,1,3,1]))
console.log(PalindromeWhile("madam"))
console.log(twoSums([2,3,4,6,7], 11))