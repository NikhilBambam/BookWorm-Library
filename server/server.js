import {app} from "./app.js" 
import {v2 as cloudinary} from "cloudinary"

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
    api_key:process.env.CLOUDINARY_CLIENT_API,
    api_secret:process.env.CLOUDINARY_CLIENT_SECRET,
})
// app.listen(process.env.PORT,()=>
// {
//  console.log(`server Is running on port ${process.env.PORT} `);
// });

const PORT = process.env.PORT || 4000;  // Fallback to 4000 for local dev

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});