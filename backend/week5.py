def factorial(nums):
    if nums==0 or nums==1:
        return 1
    return nums*factorial(nums-1)
print(factorial(4))

def factorialForloop(n):
    result=1
    for i in range(1, n+1):
        result=result*i
    return result

print(factorialForloop(5))

def isSum(num, target):
    seen={}
    for i in range(len(num)):
        current=num[i]
        need=target-current
        if need in seen:
            return [seen[need], i]
        seen[current]=i
    return []

print(isSum([2,3,4,5,3], 9))