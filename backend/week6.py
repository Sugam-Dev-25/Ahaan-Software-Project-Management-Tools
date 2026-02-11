def isFactorial(n):
    total=1
    for i in range(n):
        total=total*i
    return total
print(isFactorial(6))

def isAccending(arr):
    for i in range(len(arr)):
        for j in range(len(arr)-1):
            if arr[j]>arr[j+1]:
                arr[j], arr[j+1]=arr[j+1], arr[j]
    return arr
print(isAccending([5,6,7,3,2,1]))

def isDecending(arr):
    for i in range(len(arr)):
        for j in range(len(arr)-1):
            if arr[j+1]>arr[j]:
                arr[j+1], arr[j]=arr[j], arr[j+1]
    return arr
print(isDecending([2,3,4,5,6,7]))

def isCount(num):
    digit=0
    vowels=0
    consonent=0
    letter=0
    small_letter=0
    capital_letter=0
    for i in num:
        if "0"<=i<="9":
            digit+=1
            
        elif "a"<=i<="z":
            letter+=1
            small_letter+=1
            if i=="a" or i=="e"or i=="i" or i=="o" or i=="u":
                vowels+=1
            else:
                consonent+=1
        elif "A"<=i<="Z":
            letter+=1
            capital_letter+=1
            if i=="a" or i=="e"or i=="i" or i=="o" or i=="u":
                vowels+=1
            else:
                consonent+=1
    return letter, digit, vowels, consonent, small_letter, capital_letter

print(isCount("jdhaKJDLJLJSeeeLkdjls93482ksdjaetoegdvx324242354534534654"))
