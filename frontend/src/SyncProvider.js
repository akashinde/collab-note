import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Client } from 'twilio-sync';

const SyncContext = createContext();

export default function SyncProvider({ tokenFunc, children }) {
  const [syncClient, setSyncClient] = useState();

  useEffect(() => {
    (async () => {
      if (!syncClient) {
        const token = await tokenFunc();
        const client = new Client(token);
        client.on('tokenAboutToExpire', async () => {
          const token = await tokenFunc();
          client.updateToken(token);
        });
        setSyncClient(client);
      }
    })();

    return () => {
      if (syncClient) {
        syncClient.shutdown();
        setSyncClient(undefined);
      }
    };
  }, [syncClient, tokenFunc]);

  return (
    <SyncContext.Provider value={syncClient}>
      {children}
    </SyncContext.Provider>
  );
};

export function useSyncState(name, initialValue) {
  const sync = useContext(SyncContext);
  const [doc, setDoc] = useState();
  const [data, setDataInternal] = useState();

  useEffect(() => {
    setDoc(undefined);
    setDataInternal(undefined);
  }, [sync]);

  useEffect(() => {
    (async () => {
      if (sync && !doc) {
        const newDoc = await sync.document(name);
        if (!newDoc.data) {
          await newDoc.set({state: initialValue});
        }
        setDoc(newDoc);
        setDataInternal(newDoc.data.state);
        newDoc.on('updated', args => setDataInternal(args.data.state));
      }
    })();
    return () => { doc && doc.close() };
  }, [sync, doc, name, initialValue]);

  const setData = useCallback(value => {
    (async () => {
      if (typeof value === 'function') {
        await doc.set({state: value(data)});
      }
      else {
        await doc.set({state: value});
      }
    })();
  }, [doc, data]);

  return [data, setData];
}