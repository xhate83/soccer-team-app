export interface ITeam {
    id: number;
    nombre: string;
    estadio: string;
    sitioWeb?: string | null;
    nacionalidad: string;
    fundacion: string;
    entrenador: string
    capacidad: number;
    valor?: number | null;
}

export interface INewTeam extends Omit<ITeam, 'id'> {
}

