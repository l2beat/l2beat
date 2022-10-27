import { ProjectPermission } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { EtherscanLink } from './EtherscanLink'
import { Section } from './Section'

export interface PermissionsSectionProps {
  permissions: ProjectPermission[]
}

export function PermissionsSection(props: PermissionsSectionProps) {
  return (
    <Section title="Permissioned Addresses" id="permissionedAddresses">
      <h3 className="mt-4 font-bold md:text-md">
        The system uses the following set of permissioned addresses:
      </h3>
      <ul className="list-disc mt-4 pl-8 space-y-4">
        {props.permissions.map((permission, i) => (
          <li key={i}>
            <strong>{permission.name}</strong>{' '}
            <span
              className={cx(
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
            {permission.description && (
              <p className="text-gray-860 dark:text-gray-400">
                {permission.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  )
}
