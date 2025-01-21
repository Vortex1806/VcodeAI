import { ActionContext } from '@/context/ActionContext';
import { SandpackPreview, useSandpack } from '@codesandbox/sandpack-react'
import React, { useContext, useEffect, useRef } from 'react'

const SandpackPreviewClient = () => {
    const previewRef = useRef();
    const { sandpack } = useSandpack();
    const { action, setAction } = useContext(ActionContext);

    useEffect(() => {
        GetSandpackClient();
    }, [sandpack && action])

    const GetSandpackClient = async () => {
        const client = previewRef.current?.getClient();
        console.log(client);
        if (client) {
            const res = await client.getCodeSandboxURL();
            if (action?.actionType == 'deploy') {
                console.log(res?.sandboxId);
                window.open('https://' + res?.sandboxId + '.csb.app/')
            } else if (action?.actionType == 'export') {
                window.open(res?.editorUrl); 
            }
        }
    }
    return (
        <div className='w-full'>
            <SandpackPreview ref={previewRef} style={{ height: '80vh' }} showNavigator={true} />

        </div>
    )
}

export default SandpackPreviewClient