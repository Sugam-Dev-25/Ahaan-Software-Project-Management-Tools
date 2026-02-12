function isAnagram(s1, s2){
    if(s1.length != s2.length){
        return false
    }
    let freq={}
    for(let i of s1){
        freq[i]=(freq[i]|0)+1
    }
    for(let i of s2){
        if(!freq[i]){
            return false
        }
        freq[i]--
    }
    return true
    
}
console.log(isAnagram("apple", "palea"))

function removeDuplicate(str){
    let word={}
    let result=""
    for(let i of str){
        if(!word[i]){
            word[i]=true
            result+=i
        }
    }
    return result
}
console.log(removeDuplicate("apple"))