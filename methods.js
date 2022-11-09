function titleCase(arr){
   return arr.trim().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

} 

module.exports = titleCase