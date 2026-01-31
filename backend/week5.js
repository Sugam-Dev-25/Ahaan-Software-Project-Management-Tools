function smallestSubarraySum(nums, S) {
    let windowSum = 0
    let minLen = Infinity
    let left = 0
    for (let right = 0; right < nums.length; right++) {
        windowSum += nums[right]
        while (windowSum >= S) {
            minLen = Math.min(minLen, right - left + 1)
            windowSum -= nums[left]
            left++
        }
    }
    return minLen === Infinity ? 0 : minLen
}

function AscendingOrder(arr) {
    let freq = {}
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < (arr.length - 1) - i; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j]
                arr[j] = arr[j + 1]
               arr[j+1]=temp
            }

        }
    }
    return arr
}

console.log(AscendingOrder([2, 3, 4, 3, 1, 4, 5]))
console.log(smallestSubarraySum([2, 3, 4, 5, 1, 3, 5], 12))