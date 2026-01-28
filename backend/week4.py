def PalindromeWhile(arr):
    left=0
    right=len(arr)-1
    while left< right:
        if arr[left]!=arr[right]:
            return False
        left+=1
        right-=1
    return True

def PalindromeFor(arr):
    for i in range(len(arr)//2):
        if arr[i] != arr[len(arr)-1-i]:
            return False
    return True

def isSum(arr, target):
    seen={}
    for i in range(len(arr)):
        current=arr[i]
        need=target-current
        if need in seen:
            return [seen[need], i]
        seen[current]=i
    return []
print(isSum([2,3,5,6,4], 11))
print(PalindromeWhile("madam"))
print(PalindromeFor("madas"))
