function LargestSubString(arr){
    let seen=new set()
    let left=0
    let maxLength=0
    for(i=0; i<arr.length; i++){
        while(seen.has(arr[i])){
            seen.delete(arr[left])
        }
        arr[i]++
    }
}