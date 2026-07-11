import style from ".././css/fileUpload.module.css";
import { ImCross } from "react-icons/im";
const FileUploader = ({ base64File, setBase64File }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setBase64File(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  function handleCancel() {
    setBase64File(null);
  }
  return (
    <div className={style.div}>
      <ImCross onClick={handleCancel} className={style.cross} />
      <input className={style.input} type="file" onChange={handleFileUpload} />
      {base64File && (
        <div className={style.divImg}>
          <img
            className={style.img}
            src={base64File}
            alt="Uploaded"
            style={{ maxWidth: "300px", maxHeight: "300px" }}
          />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
