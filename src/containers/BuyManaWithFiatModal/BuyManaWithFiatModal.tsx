import * as React from 'react'
import { Network } from '@dcl/schemas'
import {
  BuyManaWithFiatModal as BaseBuyManaWithFiatModal,
  BuyManaWithFiatModalI18N,
  BuyManaWithFiatModalNetworkI18N,
  BuyManaWithFiatModalNetworkProps
} from 'decentraland-ui/dist/components/BuyManaWithFiatModal/BuyManaWithFiatModal'
import {
  BuyWithFiatNetworkProps,
  NetworkGatewayI18N,
  NetworkGatewayType,
  NetworkI18N
} from 'decentraland-ui/dist/components/BuyManaWithFiatModal/Network'
import { t } from '../../modules/translation/utils'
import {
  DefaultProps,
  Props,
  State,
  Translations
} from './BuyManaWithFiatModal.types'

export default class BuyManaWithFiatModal extends React.PureComponent<
  Props,
  State
> {
  static defaultProps: DefaultProps = {
    isLoading: false
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.hasError && this.props.hasError) {
      this.setState({
        hasError: true
      })
    } else if (prevProps.hasError && !this.props.hasError) {
      this.setState({
        hasError: false
      })
    }
  }

  private getDefaultTranslations<
    T extends Translations,
    Key extends keyof T & string
  >(basePath: string, props: Key[]): T | undefined {
    if (!this.props.hasTranslations) {
      return undefined
    }

    return Object.fromEntries(
      props.map(it => [it, t(`${basePath}.${it}`)])
    ) as T
  }

  getDefaultModalTranslations = (): BuyManaWithFiatModalI18N | undefined => {
    return this.getDefaultTranslations('@dapps.buyManaWithFiat.modal', [
      'title',
      'subtitle',
      'error'
    ])
  }

  getDefaultNetworkTranslations = (
    network: Network
  ): (BuyManaWithFiatModalNetworkI18N & NetworkI18N) | undefined => {
    return this.getDefaultTranslations(
      `@dapps.buyManaWithFiat.network.${network.toLowerCase()}`,
      ['cta', 'ctaSubtitle', 'title', 'error']
    )
  }

  getDefaultGatewayTranslations = (
    network: Network,
    gateway: NetworkGatewayType
  ): NetworkGatewayI18N | undefined => {
    return this.getDefaultTranslations(
      `@dapps.buyManaWithFiat.network.${network.toLowerCase()}.${gateway}`,
      ['title', 'subtitle', 'continueButtonText', 'learnMoreText']
    )
  }

  getDefaultNetworks() {
    const networks = [Network.MATIC, Network.ETHEREUM]
    const gateways = [NetworkGatewayType.MOON_PAY, NetworkGatewayType.TRANSAK]
    const gatewayLearnMoreLink = {
      [NetworkGatewayType.MOON_PAY]: 'https://www.moonpay.com/',
      [NetworkGatewayType.TRANSAK]: 'https://transak.com/'
    }

    const isDisabled = (network: Network, gateway: NetworkGatewayType) =>
      network === Network.MATIC && gateway === NetworkGatewayType.MOON_PAY

    return networks.map(
      network =>
        ({
          type: network,
          i18n: this.getDefaultNetworkTranslations(network),
          gateways: gateways
            .filter(gateway => !isDisabled(network, gateway))
            .map(gateway => ({
              type: gateway,
              i18n: this.getDefaultGatewayTranslations(network, gateway),
              learnMoreLink: gatewayLearnMoreLink[gateway],
              onContinue: () => this.handleOnContinue(network, gateway)
            }))
        } as BuyManaWithFiatModalNetworkProps & BuyWithFiatNetworkProps)
    )
  }

  handleOnContinue(network: Network, gateway: NetworkGatewayType) {
    this.props.onContinue && this.props.onContinue(network, gateway)
    this.handleOnClose()
  }

  handleOnClose() {
    this.props.onClose && this.props.onClose()
  }

  render() {
    const {
      open,
      i18n,
      className,
      isLoading,
      selectedNetwork,
      onInfo
    } = this.props
    const { hasError } = this.state
    const networks = this.props.networks || this.getDefaultNetworks()

    return (
      <>
        <BaseBuyManaWithFiatModal
          open={open}
          className={className}
          i18n={i18n || this.getDefaultModalTranslations()}
          networks={
            selectedNetwork
              ? networks.filter(network => network.type === selectedNetwork)
              : networks
          }
          loading={isLoading}
          hasError={hasError}
          onClose={() => this.handleOnClose()}
          onInfo={onInfo}
        />
      </>
    )
  }
}
