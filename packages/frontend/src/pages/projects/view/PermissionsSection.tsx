import { Layer2Permission } from '@l2beat/config'
import classNames from 'classnames'
import React from 'react'

import { config } from '../../config'
import { EtherscanLink } from './EtherscanLink'
import { Section } from './Section'

export interface PermissionsSectionProps {
  editLink: string
  issueLink: string
  permissions: Layer2Permission[]
}

export function PermissionsSection(props: PermissionsSectionProps) {
  if (!config.showPermissionedAccounts) {
    return null
  }
  return (
    <Section
      title="Permissioned Addresses"
      id="permissionedAddresses"
      className="PermissinedAddressesSection"
      editLink={props.editLink}
      issueLink={props.issueLink}
    >
      <p className="mt-4">
        The system uses the following set of permissioned addresses:
      </p>
      <ul className="list-disc mt-4 pl-8 space-y-4">
        {props.permissions.map((permission, i) => (
          <li key={i}>
            <div className="PermissionsSection-Address">
              <strong>{permission.name}</strong>{' '}
              <span
                className={classNames(
                  'text-sm lg:text-base',
                  permission.accounts.length > 1 && 'block',
                )}
              >
                {permission.accounts.map((account, i, { length }) => (
                  <React.Fragment key={i}>
                    <EtherscanLink key={i} address={account.address}>
                      &nbsp;{`(${account.type})`}
                    </EtherscanLink>
                    {i !== length - 1 && <span>, </span>}
                  </React.Fragment>
                ))}
              </span>
            </div>
            {permission.description && (
              <div className="PermissionsSection-Description">
                {permission.description}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Section>
  )
}
