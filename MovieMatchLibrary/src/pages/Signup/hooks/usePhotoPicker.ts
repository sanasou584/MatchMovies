import { useState } from "react";
import { Camera } from "@capacitor/camera";

/** Picks a profile photo from the device gallery. */
export const usePhotoPicker = () => {
  const [photo, setPhoto] = useState("");

  const takePhoto = async () => {
    try {
      const { results } = await Camera.chooseFromGallery({
        quality: 60,
        targetWidth: 360,
        targetHeight: 360,
        limit: 1,
      });

      if (results.length > 0 && results[0].webPath) {
        setPhoto(results[0].webPath);
      }
    } catch (error) {
      console.log("Gallery dismissed or cancelled:", error);
    }
  };

  return { photo, takePhoto };
};
