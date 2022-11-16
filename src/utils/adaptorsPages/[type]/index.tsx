import { GetStaticProps, GetStaticPropsContext } from 'next'
import * as React from 'react'
import { revalidate } from '~/api'
import { getChainPageData } from '~/api/categories/adaptors'
import OverviewContainer, { IOverviewContainerProps } from '~/containers/Overview'
import { upperCaseFirst } from '~/containers/Overview/utils'
import Layout from '~/layout'

export const getStaticProps: GetStaticProps<IOverviewContainerProps> = async ({
	params
}: GetStaticPropsContext<{ type: string; chain: string }>) => {
	const data = await getChainPageData(params.type, params.chain)
	return {
		props: {
			...data,
			type: params.type
		},
		revalidate: revalidate()
	}
}

export const getStaticPropsByType = (type: string) => {
	return (context) =>
		getStaticProps({
			...context,
			params: {
				...context.params,
				type
			}
		})
}

const AllChainsDexs = (props: IOverviewContainerProps) => {
	return (
		<Layout title={`${upperCaseFirst(props.type)} - DefiLlama`}>
		
			<OverviewContainer {...props} />
		</Layout>
	)
}

export default AllChainsDexs
