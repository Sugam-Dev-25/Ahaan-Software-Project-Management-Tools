function maxnum(nums){
    let max=nums[0];

    for(let i=1; i<nums.length; i++){
        if(nums[i]>max){
            max= nums[i]
        }
    }
    return max
}

console.log(maxnum([9,4,5,1,3]))

const maxnumber=num=>Math.max(...num)

console.log(maxnum([2,3,4,9,6, 10]))

console.log(Math.max(...[2,5,4,6]))