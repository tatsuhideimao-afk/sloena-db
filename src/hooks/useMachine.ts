import { useState, useEffect } from 'react';
import { loadMachine } from '../data';
import { Machine } from '../types/machine';

export function useMachine(id: string | undefined) {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    if (!id) {
      setMachine(null);
      setLoading(false);
      return;
    }
    loadMachine(id).then((m) => {
      if (active) {
        setMachine(m);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [id]);

  return { machine, loading };
}
