function factorialforloop(nums){
    let result=1
    for(let i=1; i<=nums; i++){
        result=result*i
    }
    return result
}
console.log(factorialforloop(5))

function factorial(n){
    if(n===0 || n===1){
        return 1
    }
    return n*factorial(n-1)

}
console.log(factorial(5))

function isSum(nums, target){
    let seen={}
    for(let i=0; i<nums.length; i++){
        let current=nums[i]
        let need=target-current
        if(need in seen){
            return [seen[need], i]
        }
        seen[current]=i

    }
    return []
}
console.log(isSum([2,3,4,5,8,3], 11))