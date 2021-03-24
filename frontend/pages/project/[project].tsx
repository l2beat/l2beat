import { useRouter } from 'next/router'
import React from 'react'
import { AppContainer } from '../../components/AppContainer'
import { PageGrid } from '../../components/PageGrid'
import styles from '../../styles/Home.module.scss'
import millify from 'millify'
import 'react-vis/dist/style.css'
import cx from 'classnames'

import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import LinkIcon from '@material-ui/icons/Link';

import l2Data from '../../data/l2-data.json'
import projectsMeta from '../../data/projects-data.json'
import { Graph } from '../../components/Graph'
import { tvlSorter } from '../../utils/tvlSorter'
import Link from 'next/link'

export default function Project(props: ReturnType<typeof getStaticProps>['props']) {
    const { query } = useRouter()
    console.log(props)

    const tvlHistory = React.useMemo(() => props.tvlData
        .map(({ x, y }) => ({ x: new Date(x), y }))
        , [l2Data])


    const badgeText = Math.abs(props.tvl) < 0.01
        ? `${props.tvlDelta > 0 ? '>' : '<-'}0.01%`
        : `${(props.tvlDelta).toFixed(2)}%`

    return (
        <AppContainer>
            <h2 className={styles.overview}>
                {props.name} overview
            </h2>
            <PageGrid>
                <div className={styles.card}>
                    <Graph
                        title={`${props.name} total value locked in USD`}
                        data={tvlHistory}
                    />
                </div>
                <div className={cx(styles.card, styles.cardBg, styles.overviewCard)}>
                    <div className={styles.title}>
                        <MonetizationOnIcon />
                        <h3>Overview</h3>
                        <div
                            className={cx(
                                styles.badge,
                                {
                                    [styles.badgeUp]: props.tvlDelta > 0,
                                    [styles.badgeDown]: props.tvlDelta < 0,
                                })
                            }
                        >
                            {badgeText}
                            {
                                props.tvlDelta === 0
                                    ? <TrendingFlatIcon />
                                    : props.tvlDelta > 0
                                        ? <TrendingUpIcon />
                                        : <TrendingDownIcon />
                            }
                        </div>
                    </div>
                    <div className={styles.overview}>
                        <div className={styles.tvl}>${millify(props.tvl)}</div>
                        <div className={styles.description}>Total value locked</div>
                        <div className={styles.dominance}>
                            <Link href={props.projectMeta.website}>
                                <div className={styles.projectWebsite}>
                                    {props.name}
                                    <LinkIcon fontSize="large" />
                                </div>
                            </Link>
                        </div>
                        <div className={styles.description}>project website</div>
                    </div>
                </div>
            </PageGrid>
        </AppContainer>
    )
}

export function getStaticPaths() {
    const projects = Object.keys(l2Data.l2s).map(slug => slug.toLowerCase())

    return {
        paths: projects.map((project) => {
            return {
                params: {
                    project,
                },
            }
        }),
        fallback: false,
    }
}

export function getStaticProps(params: { params: { project: string } }) {
    const [name, projectData] = Object
        .entries(l2Data.l2s)
        .find(([projectName]) => projectName.toLowerCase() === params.params.project)!

    const tvlData = projectData
        .data.sort(tvlSorter)
        .map(point => ({ x: point.date, y: point.usd }))

    const tvlDelta = (projectData.data[projectData.data.length - 1].usd / projectData.data[projectData.data.length - 2].usd) * 100 - 100

    const [, projectMeta] = Object.entries(projectsMeta).find(([projectName]) => projectName.toLowerCase() === params.params.project)!


    return {
        props: { tvlData, name, tvl: projectData.TVL, tvlDelta, projectMeta },
    }
}