import React from 'react';
import { Form } from 'react-bootstrap';
import { InputProps } from '@/components/models';

import sytles from './style.module.scss';

export const InputText = ({
    type = 'text',
    name,
    label,
    placeholder,
    value,
    onChange,
    disabled = false,
    required = false,
    containerClassName = '',
    labelClassName = '',
    inputClassName = '',
    controlId = '',
    errorMessage = '',
    defaultValue,
    checked = false,
    ...rest
}: InputProps) => {
    let errorStyle = 'border-danger';
    return (
        <>
            <Form.Group className={`text-start form-group ${containerClassName}`} controlId={name}>
                <Form.Label className={labelClassName}>{label}</Form.Label>
                <Form.Control
                    className={`${sytles.formInput} form-control ${errorMessage && errorStyle} ${inputClassName}`}
                    placeholder={placeholder}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    defaultValue={defaultValue}
                    checked={checked}
                    {...rest}
                />
                {errorMessage && <Form.Text className="text-danger">{errorMessage}</Form.Text>}
            </Form.Group>
        </>

    );
};
