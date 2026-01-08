function CountArray(nums){
    let count=0;
    for (let i=0; i<nums.length; i++){
        if(nums[i] % 2 === 0){
            count=count+1
        }
    }
    return count
}
console.log(CountArray([2,4,5,2,1,6, 6,6]))