import React, { useState, useEffect, useRef } from "react";
import { Upload, Button, Modal, Image, Spin, message} from "antd";
import { EditOutlined } from "@ant-design/icons";
import AvatarEditor from "react-avatar-editor";
import { fetchProfilePicture, uploadProfilePicture } from "../../services/profile/profileService";

const ProfilePicture = ({ userId }) => {
    const DEFAULT_IMAGE = "/default_pfp.png";
    const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        fetchProfilePicture(userId)
            .then((url) => {if (url) {setImageUrl(url);} 
                else {setImageError(true);}})
            .catch(() => setImageError(true))
            .finally(() => setLoading(false));
    }, [userId]);

    const handleUpload = async () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImageScaledToCanvas();
            const imageBase64 = canvas.toDataURL("image/jpeg").split(",")[1];

            try {
                const response = await uploadProfilePicture(userId, imageBase64);
                if (response?.imageUrl){
                    setImageUrl(`${response.imageUrl}?t=${new Date().getTime()}`);
                    setImageError(false);
                }
                setSelectedFile(null);
                setIsEditing(false);

                message.success("Profile picture successfully updated.");

                setLoading(true);
                fetchProfilePicture(userId)
                    .then((url) => setImageUrl(url || DEFAULT_IMAGE))
                    .catch(() => setImageError(true))
                    .finally(() => setLoading(false));

            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    };

    return (
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {loading ? (
                <Spin size="large" />
            ) : (
                <div style={{ position: "relative", width: "150px", height: "150px" }}>
                                        {/* Profile Picture */}
                    <Image
                        width={150}
                        height={150}
                        style={{ borderRadius: "50%", display: imageError ? "none" : "block" }}
                        src={imageUrl}
                        onError={() => setImageError(true)}
                        preview={{ mask: false, toolbarRender: () => null }}
                    />

                    {/* Fallback Image (Overlay on Failure) */}
                    {imageError && (
                        <img
                            src={DEFAULT_IMAGE}
                            width={150}
                            height={150}
                            style={{
                                borderRadius: "50%",
                                position: "absolute",
                                top: 0,
                                left: 0
                            }}
                            alt="Default Profile"
                        />
                    )}
                </div>
            )}

            {!loading && (
                <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)} style={{ marginTop: "10px", width: "100px" }}>
                    Change
                </Button>
            )}

            <Modal title="Edit Profile Picture" open={isEditing} onCancel={() => setIsEditing(false)} onOk={handleUpload}>
                <div style={{ textAlign: "center" }}>
                    {selectedFile ? (
                        <AvatarEditor
                            ref={editorRef}
                            image={URL.createObjectURL(selectedFile)}
                            width={200}
                            height={200}
                            border={50}
                            scale={1.2}
                        />
                    ) : (
                        <p>Select an image to upload</p>
                    )}
                    <div style={{ marginTop: "10px" }}>
                        <Upload beforeUpload={(file) => { setSelectedFile(file); return false; }} showUploadList={false}>
                            <Button>Select Image</Button>
                        </Upload>
                    </div>
                </div>
            </Modal>
        </div>
    );
};


export default ProfilePicture;
