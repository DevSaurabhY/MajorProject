export default (fn) => {
    return  (req,res,next) => {
        fn(req, res, next).catch(next);
    }
}

// export default asyncHandler;

// const asyncHandler =  function wrapAsync(fn)  {
//     return function (req,res,next) {
//         fn(req, res, next).catch(next);
//     }
// }

// export default asyncHandler;