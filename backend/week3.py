def RemoveStr(str):
    seen=set()
    result=""
    for i in str:
        if i not in seen:
            seen.add(i)
            result+=i
    return result

def IsAnagram(s1, s2):
    if len(s1) != len(s2):
        return False
    freq={}
    for i in s1:
        if i in freq:
            freq[i]+=1
        else:
            freq[i]=1
    for i in s2:
        if i not in freq or freq[i]==0:
            return False
        freq[i]-=1
    return True


print(RemoveStr("hello"))
print(IsAnagram("hello", "llooh"))
