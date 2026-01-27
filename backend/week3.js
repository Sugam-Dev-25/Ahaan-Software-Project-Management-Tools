function Remove(str) {
    let string = {}
    let result = ""
    for (let i of str) {
        if (!string[i]) {
            string[i] = true
            result += i

        }
    }
    return result
}

function IsAnagram(s1, s2) {
    if (s1.length !== s2.length) return false
    freq = {}
    for (let i of s1) {

        freq[i] = (freq[i] | 0) + 1

    }
    for (let i of s2){
        if(!freq[i]){
            return false
        }
        freq[i]--
    }
    return true
}

console.log(Remove("ollweooe"))
console.log(IsAnagram("listen", "stenli"))