export interface UserRegister {
    email: string;
    password: string;
    password2: string;
    name: string;
    middleName: string;
    lastName: string;
    secondLastName: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface JwtError {
    name: string;
    message: string;
    expireAt: Date;
}

export interface RequestSkillsTypes {
    idSkill: number;
}
