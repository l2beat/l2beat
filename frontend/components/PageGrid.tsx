import React from 'react';
import styles from './Grid.module.scss';

export function PageGrid(props: React.PropsWithChildren<{}>) {
    return (
        <div className={styles.grid}>
            {props.children}
        </div>
    );
}
