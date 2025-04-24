import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { downloadFile } from '../utils/helpers'

const FileRedirectHandler = () => {
    const { fileId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const handleAction = async () => {

            const token = localStorage.getItem('token')
            if (!token) {
                toast.error("You're not logged in!");
                navigate('/login')
                return;
            }

            try {
                const putRes = await fetch(`http://3.12.1.104:4000/api/files/${fileId}/access`,
                    {
                        method: "PUT",
                        headers: {
                            "x-auth-token": localStorage.token,
                        }
                    }

                );

                console.log(putRes.status);
                console.log(putRes.body);

                const fileRes = await fetch(`http://3.12.1.104:4000/api/files/${fileId}`, {
                    method: "GET",
                    headers: {
                        "x-auth-token": localStorage.token,
                    }
                });

                var file = await fileRes.json();
                file = file.file;
                console.log(file);

                toast.success(`File ${file.name} added to you account!`);
                await downloadFile(file.fileUrl);
                navigate('/dashboard');
            } catch (err) {
                console.error(err)
                toast.error("Something went wrong")
                navigate('/dashboard')
            }
        }

        handleAction()
    }, [])

    return <p className="text-center mt-10">Processing file action...</p>
}

export default FileRedirectHandler