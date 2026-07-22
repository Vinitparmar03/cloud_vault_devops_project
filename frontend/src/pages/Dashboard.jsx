import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import {
    createVault,
    getVaults,
    deleteVault,
} from "../services/vaultApi";

const Dashboard = () => {

    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);

    const [vaults, setVaults] = useState([]);

    const loadVaults = async () => {
        const res = await getVaults();
        setVaults(res.data);
    };

    useEffect(() => {
        loadVaults();
    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append("title", title);
        formData.append("file", file);

        await createVault(formData);

        setTitle("");
        setFile(null);

        loadVaults();
    };


    const handleDelete = async (id) => {
        await deleteVault(id);
        loadVaults();
    };

    return (
        <>
            <Navbar />

            <div
                style={{
                    maxWidth: "1200px",
                    margin: "40px auto",
                    padding: "20px",
                }}
            >

                <form
                    onSubmit={handleSubmit}
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 15px rgba(0,0,0,.1)",
                        marginBottom: "40px",
                    }}
                >

                    <h2>Upload File</h2>

                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={inputStyle}
                    />

                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        style={inputStyle}
                    />

                    <button
                        style={uploadButton}
                    >
                        Upload
                    </button>

                </form>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill,minmax(280px,1fr))",
                        gap: "20px",
                    }}
                >

                    {vaults.map((vault) => (

                        <div
                            key={vault._id}
                            style={cardStyle}
                        >

                            {vault.file?.resource_type === "image" && (

                                <img
                                    src={vault.file.secure_url}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: "180px",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                    }}
                                />

                            )}

                            <h3>{vault.title}</h3>

                            <p
                                style={{
                                    color: "#666",
                                }}
                            >
                                {vault.file?.original_name}
                            </p>

                            <p>
                                {(vault.file?.bytes / 1024).toFixed(2)} KB
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "15px",
                                }}
                            >

                                <a
                                    href={vault.file?.secure_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={viewButton}
                                >
                                    Open
                                </a>

                                <button
                                    onClick={() =>
                                        handleDelete(vault._id)
                                    }
                                    style={deleteButton}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </div>
        </>
    );
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
};

const uploadButton = {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
};

const cardStyle = {
    background: "white",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,.12)",
};

const viewButton = {
    background: "#10b981",
    color: "white",
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: "8px",
};

const deleteButton = {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
};

export default Dashboard;