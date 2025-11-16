import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger,
  keyframes,
  animation
} from '@angular/animations';

// Animación de entrada escalonada para formularios
export const formAnimations = trigger('formAnimations', [
  transition(':enter', [
    query('.anim-item', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(100, [
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

// Animación del logo con rotación lunar
export const logoAnimation = trigger('logoAnimation', [
  transition(':enter', [
    animate('1000ms cubic-bezier(0.4, 0, 0.2, 1)', 
      keyframes([
        style({ opacity: 0, transform: 'scale(0.8) rotate(-180deg)' }),
        style({ opacity: 1, transform: 'scale(1.05) rotate(0deg)' }),
        style({ transform: 'scale(1)' })
      ])
    )
  ]),
  state('pulse', style({ transform: 'scale(1.1)' })),
  transition('* <=> pulse', animate('300ms ease'))
]);

// Animación de error para inputs
export const shakeAnimation = trigger('shake', [
  state('void', style({ transform: 'translateX(0)' })),
  transition('* => error', [
    animate('500ms ease-in', keyframes([
      style({ transform: 'translateX(0)' }),
      style({ transform: 'translateX(-8px)' }),
      style({ transform: 'translateX(8px)' }),
      style({ transform: 'translateX(-8px)' }),
      style({ transform: 'translateX(0)' })
    ]))
  ])
]);