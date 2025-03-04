import React from 'react';
import { Award, Globe, Calendar, Flame, Sun, Crown, Heart, Star, Baby, Briefcase, Globe2, Sparkles, Users, Camera, User, Coffee, Users2, Candy, Armchair as Wheelchair, PartyPopper, Church, Skull, Flag, BellRing as Ring, Scale, Plane, UserX } from 'lucide-react';
import type { MedalDisplay } from '../types';

export const medals: MedalDisplay[] = [
  {
    id: 'centenariazo',
    name: 'Centenariazo',
    description: 'Alcanza 100 puntos totales en el reto',
    icon: <Award className="w-8 h-8" />
  },
  {
    id: 'willy-wonka',
    name: 'Willy Wonka',
    description: '5 chupa chupa',
    icon: <Crown className="w-8 h-8" />
  },
  {
    id: 'workaholic',
    name: 'Workaholic',
    description: 'Puntos cada día de la semana',
    icon: <Calendar className="w-8 h-8" />
  },
  {
    id: 'celibe',
    name: 'Celibe',
    description: '1 mes sin puntos',
    icon: <Heart className="w-8 h-8" />
  },
  {
    id: 'willy-fog',
    name: 'Willy Fog',
    description: 'Acumula 3 nacionalidades',
    icon: <Globe className="w-8 h-8" />
  },
  {
    id: 'picaro',
    name: 'Pícaro de playa',
    description: 'Puntos de 2 personas distintas en un día',
    icon: <Sun className="w-8 h-8" />
  },
  {
    id: 'chaima',
    name: 'Chaima',
    description: 'Gana 1 trimestre',
    icon: <Star className="w-8 h-8" />
  },
  {
    id: 'julio-iglesias',
    name: 'Julio Iglesias',
    description: 'Gana puntos fuera del país',
    icon: <Globe2 className="w-8 h-8" />
  },
  {
    id: 'rodri',
    name: 'Rodri',
    description: 'Consigue tu balón de oro',
    icon: <Sparkles className="w-8 h-8" />
  },
  {
    id: 'madre-jose',
    name: 'La madre de Jose',
    description: 'Puntúa con una 15 años mayor mínimo',
    icon: <Users className="w-8 h-8" />
  },
  {
    id: 'harvey',
    name: 'Harvey',
    description: 'Puntos con alguien del sector',
    icon: <Briefcase className="w-8 h-8" />
  },
  {
    id: 'amoroso',
    name: 'Amoroso',
    description: 'Hacerlo sin poder conseguir más puntos',
    icon: <Heart className="w-8 h-8" />
  },
  {
    id: 'criador-pokemon',
    name: 'Criador Pokemon',
    description: 'Puntos con una de máximo 20 años',
    icon: <Baby className="w-8 h-8" />
  },
  {
    id: 'destrozahogares',
    name: 'Destrozahogares',
    description: 'Puntos con una con pareja',
    icon: <Heart className="w-8 h-8 text-red-500" />
  },
  {
    id: 'isabel-pantoja',
    name: 'Isabel Pantoja',
    description: 'Puntos con una influencer',
    icon: <Camera className="w-8 h-8" />
  },
  {
    id: 'ambiguo',
    name: 'Ambiguo',
    description: 'Puntos con alguien de jarler',
    icon: <User className="w-8 h-8" />
  },
  {
    id: 'papuchi',
    name: 'Papuchi',
    description: 'Puntos con alguien de máximo 20 años',
    icon: <Coffee className="w-8 h-8" />
  },
  {
    id: 'yoko-ono',
    name: 'Yoko Ono',
    description: 'Puntos con chicas de la misma familia',
    icon: <Users2 className="w-8 h-8" />
  },
  {
    id: 'bruno-quiroga',
    name: 'Bruno Quiroga',
    description: 'Consigue un chupa chupa en la calle',
    icon: <Candy className="w-8 h-8" />
  },
  {
    id: 'bebe-vio',
    name: 'Bebe Vio o Frida Kahlo',
    description: 'Que pueda aparcar en un parking de discapacitados',
    icon: <Wheelchair className="w-8 h-8" />
  },
  {
    id: 'maricon-oro',
    name: 'Maricón de Oro',
    description: 'Puntos en una fiesta gay',
    icon: <PartyPopper className="w-8 h-8" />
  },
  {
    id: 'virgen-guadalupe',
    name: 'La Virgen de Guadalupe',
    description: 'Puntos con alguien que diga que es virgen',
    icon: <Church className="w-8 h-8" />
  },
  {
    id: 'trio-mal',
    name: 'Trío del Mal',
    description: 'Puntos con 3 chicas diferentes en la misma semana',
    icon: <Skull className="w-8 h-8" />
  },
  {
    id: 'fifa-ultimate',
    name: 'FIFA Ultimate',
    description: 'Puntos con chicas de dos nacionalidades distintas en la misma noche',
    icon: <Flag className="w-8 h-8" />
  },
  {
    id: 'concha-viuda',
    name: 'Concha la Viuda',
    description: 'Puntos con alguien que enviudó',
    icon: <Ring className="w-8 h-8" />
  },
  {
    id: 'comisario',
    name: 'El Comisario',
    description: 'Puntos con alguien del ámbito legal: abogada, jueza o policía',
    icon: <Scale className="w-8 h-8" />
  },
  {
    id: 'modo-avion',
    name: 'Modo Avión',
    description: 'Consigue puntos sin usar apps de mensajería. Solo permitido el correo electrónico o sms',
    icon: <Plane className="w-8 h-8" />
  },
  {
    id: 'cebo-perfecto',
    name: 'El Cebo Perfecto',
    description: 'Consigue puntos fingiendo ser otra persona',
    icon: <UserX className="w-8 h-8" />
  }
];