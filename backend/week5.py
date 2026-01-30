def FindWordCount(str):
    str=str.lower().split()
    freq={}
    for i in str:
        if i in freq:
            freq[i]+=1
        else:
            freq[i]=1
    return freq

def finddigitLetter(str):
    digit=0
    letter=0
    for i in str:
        if "0"<=i<="9":
            digit+=1
        if "a"<=i<="z":
            letter+=1
    return digit, letter

def MaxsumArray(nums, k):
    maxWindow=0
    maxSum=0
    for i in range(k):
        maxWindow+=nums[i]
    maxSum=maxWindow
    for i in range(k, len(nums)):
        maxWindow+=nums[i]
        maxWindow-=nums[i-k]

        maxSum=max(maxSum, maxWindow)
    return maxSum

print(MaxsumArray([3,2,4,5,5,6,7], 3))

print(finddigitLetter("jkahdkj8234hd8234jd"))
print(FindWordCount("this is fuck boy who fuck some one this"))
