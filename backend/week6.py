def isPrime(n):
    if n<=1:
        return False
    for i in range(2, n):
        if (n%i)==0:
            return False
    return True
print(isPrime(7))
print(isPrime(9))

def mostFreqChar(str):
    freq={}
    for i in str:
        if i in freq:
            freq[i]+=1
        else:
            freq[i]=1
    return freq

print(mostFreqChar("thisbnahkjdkajahd"))

def reverseArrayFor(arr):
    for i in range(len(arr)//2):
        arr[i], arr[len(arr)-1-i]=arr[len(arr)-1-i], arr[i]
    return arr
print(reverseArrayFor([3,4,5,6,2,1])) 

def reverseArrayWhile(arr):
    left=0
    right=len(arr)-1
    while left<right:
        arr[left], arr[right]=arr[right], arr[left]
        left+=1
        right-=1
    return arr

print(reverseArrayWhile([6,5,4,3,2,1]))
def reverseString(str):
    return str[::-1]

def reverseStringLogic(str):
    num_str=""
    for i in range(len(str)-1, -1, -1):
        num_str+=str[i]
    return num_str

print(reverseString("hgdkjhjksa"))
print(reverseStringLogic("kgjsfsjj"))