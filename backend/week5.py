def LongesString(str):
    seen= set()
    left=0
    maxLength=0
    for i in range(len(str)):
        while str[i] in seen:
            seen.remove(str[left])
            left+=1
        seen.add(str[i])
        maxLength=max(maxLength, i-left+1)
    return maxLength, seen

print(LongesString("abcadsj"))