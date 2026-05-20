import machinesData from './machines.json';
import { Machine } from '../types/machine';

type MachineModule = Promise<{ default: Machine }>;

const machineModules: Record<string, () => MachineModule> = {
  'tokyo-ghoul': () => import('./tokyo-ghoul.json') as unknown as MachineModule,
  'hokuto-tensei2': () => import('./hokuto-tensei2.json') as unknown as MachineModule,
  'god-kamigami': () => import('./god-kamigami.json') as unknown as MachineModule,
  'kabaneri2': () => import('./kabaneri2.json') as unknown as MachineModule,
  'bigdream': () => import('./bigdream.json') as unknown as MachineModule,
  'monkey-v': () => import('./monkey-v.json') as unknown as MachineModule,
  'okidoki-gold': () => import('./okidoki-gold.json') as unknown as MachineModule,
  'okidoki-black': () => import('./okidoki-black.json') as unknown as MachineModule,
};

export const allMachines: Machine[] = machinesData as unknown as Machine[];

export async function loadMachine(id: string): Promise<Machine | null> {
  const loader = machineModules[id];
  if (!loader) {
    return allMachines.find((m) => m.id === id) || null;
  }
  const mod = await loader();
  return mod.default;
}
