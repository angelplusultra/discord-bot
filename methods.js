function titleCase(arr){
   return arr.trim().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

} 

const movieQuery = (string, substr) => {
   return string
      .substring(substr)
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

}
function getMinutesBetweenDates(startDate, endDate) {
   var diff = endDate.getTime() - startDate.getTime();
   return (diff / 60000);
}

module.exports = {
   titleCase: titleCase,
   querySplitter: movieQuery,
   getMinutesBetweenDates: getMinutesBetweenDates
} 