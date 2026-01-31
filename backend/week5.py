def sumOfMinArray(nums, S):
    variableSum=0
    minSum=float('inf')
    left=0
    for right in range(len(nums)):
        variableSum+=nums[right]
        while variableSum>=S:
            minSum=min(minSum, right-left+1)
            variableSum-=nums[left]
            left+=1
  
    if minSum==float('inf'):
        return 0
    else:
        return minSum

print(sumOfMinArray([2,2,3,4,5,6,3], 9))

def AscendingOrder(arr):
    for i in range(len(arr)):
        for j in range(len(arr)-1-i):
            if arr[j]>arr[j+1]:
                arr[j], arr[j+1]=arr[j+1], arr[j]
    return arr
print(AscendingOrder([5,6,7,3,1,3,5,9,8]))