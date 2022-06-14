import { ProjectPermission } from '@l2beat/config'
import React from 'react'

import { config } from '../../../config'
import { EtherscanLink } from './EtherscanLink'
import { Section } from './Section'

export interface PermissionsSectionProps {
  editLink: string
  issueLink: string
  permissions: ProjectPermission[]
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
      <p>The system uses the following set of permissioned addresses:</p>
      <ul className="PermissionsSection-Addresseses">
        {props.permissions.map((permission, i) => (
          <li key={i}>
            <div className="PermissionsSection-Address">
              <strong className="PermissionsSection-Name">
                {permission.name}
              </strong>{' '}
              {permission.accounts.map((account, i) => (
                <EtherscanLink
                  key={i}
                  address={account.address}
                >{` (${account.type})`}</EtherscanLink>
              ))}
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
