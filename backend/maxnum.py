def max_number(nums):
    max_num=nums[0]
    for i in range(1, len(nums)):
        if nums[i]>max_num:
            max_num=nums[i]
    return max_num

print(max_number([2,3,8,5,1,0]))