declare module 'react-textfit' {
    import * as React from 'react';

    export interface TextfitProps {
        mode?: 'single' | 'multi';
        forceSingleModeWidth?: boolean;
        min?: number;
        max?: number;
        throttle?: number;
        autoResize?: boolean;
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
        onReady?: (fontSize: number) => void;
    }

    export class Textfit extends React.Component<TextfitProps> {}
}
