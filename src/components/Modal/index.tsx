/** *******************************************************************************************************************
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
  
  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.                                                                              *
 ******************************************************************************************************************** */

import React, { useState, useEffect, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import clsx from 'clsx';

import Container from '../../layouts/Container';

export interface ModalProps {
    /** Whether the modal should be displayed */
    visible?: boolean;
    /** The title to display */
    title: string;
    /** The subtitle to display */
    subtitle?: string;
    /** The content of the modal */
    children: ReactNode;
    /** A footer to display */
    footer?: ReactNode;
    /** Callback for when the user dismisses the modal */
    onClose?: Function;
    /** the width of the modal */
    width?: string;
}

/** A modal is a pop-up dialog that can be used to prompt a user for confirmation. */
const Modal = ({ visible = false, children, title, subtitle, footer, onClose, width }: ModalProps) => {
    const [isVisible, setVisible] = useState(false);
    const useStyles = makeStyles({
        cyclorama: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            opacity: 0,
            zIndex: -9999,
            background: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            transition: 'opacity 0.2s linear',
        },
        cycloramaActive: {
            opacity: 1,
            zIndex: 1299,
        },
        modalPlaceholder: {
            width: width || '600px',
            margin: 'auto',
            position: 'relative',
        },
        closeButton: {
            padding: 0,
            '& > .MuiIconButton-label': {
                padding: 0,
            },
        },
    });
    const styles = useStyles({});

    useEffect(() => {
        setVisible(visible);
    }, [visible]);

    const handleClose = () => {
        setVisible(false);
        onClose?.();
    };

    const CloseButton = () => (
        <IconButton className={styles.closeButton} onClick={handleClose} aria-label="close">
            <Close />
        </IconButton>
    );

    return (
        <section data-testid="modal" className={clsx(styles.cyclorama, { [styles.cycloramaActive]: isVisible })}>
            <div data-testid="modal-inner" className={styles.modalPlaceholder}>
                <Container title={title} subtitle={subtitle} actionGroup={<CloseButton />} footerContent={footer}>
                    {children}
                </Container>
            </div>
        </section>
    );
};

export default Modal;
